import React, { Component } from 'react'
import pathModule from 'path'
import rimraf from 'rimraf'
import { connect } from 'react-redux'
import fs from 'fs'
import { shell, clipboard } from 'electron'
import beautifyJS from 'js-beautify'
import SplitPane from 'react-split-pane'

import defaultMJML from 'data/defaultMJML'

import { openModal } from 'reducers/modals'
import { addAlert } from 'reducers/alerts'
import { setPreview } from 'actions/preview'
import { openTab } from 'reducers/tabs'

import { fileDialog, saveDialog, fsWriteFile } from 'helpers/fs'

import FileTabs from 'components/FileTabs'
import TabContent from 'components/TabContent'
import FileExplorer from 'components/FileExplorer'

import SendModal from './SendModal'
import RemoveFileModal from './RemoveFileModal'
import ProjectToolbar from './ProjectToolbar'

import takeScreenshot from 'helpers/takeScreenshot'

import './style.scss'

@connect(
  state => {
    const focusedTab = state.tabs.find(t => t.get('isFocused'))
    return {
      preview: state.preview,
      previewSize: state.settings.get('previewSize'),
      beautifyOutput: state.settings.getIn(['mjml', 'beautify']),
      tabs: state.tabs,
      focusedFilePath: focusedTab ? focusedTab.get('path') : null,
    }
  },
  {
    openModal,
    addAlert,
    setPreview,
    openTab,
  },
)
class ProjectPage extends Component {
  state = {
    path: this.props.location.query.path,
    activeFile: null,
  }

  componentDidMount() {
    this._page.focus()
  }

  componentWillUnmount() {
    this.props.setPreview(null)
  }

  handleBeautify = () => this._editor.beautify()

  handlePathChange = path => this.setState({ path, activeFile: null })

  handleClickImport = () => {
    const p = fileDialog({
      defaultPath: this.props.location.query.path,
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['mjml'] }],
    })

    if (!p) {
      return
    }

    fs.readFile(p, { encoding: 'utf8' }, (err, res) => {
      if (err) {
        return
      }
      this._content = res
    })
  }

  handleAddFile = fileName => {
    fs.writeFile(fileName, defaultMJML, err => {
      if (err) {
        return
      }
      this._filelist.refresh()
    })
  }

  handleRemoveFile = fileName => {
    rimraf(fileName, err => {
      if (err) {
        return
      }
      this._filelist.refresh()
      this.setState({ activeFile: null })
    })
  }

  handleOpenInBrowser = () => {
    if (process.platform === 'darwin') {
      shell.showItemInFolder(this.state.path)
    } else {
      shell.openItem(this.state.path)
    }
  }

  handleActiveFileChange = activeFile => this.setState({ activeFile })

  handleCopyHTML = () => {
    const htmlContent = this.getHTMLOutput()
    clipboard.writeText(htmlContent)
    this.props.addAlert('Copied!', 'success')
  }

  handleExportToHTML = async () => {
    const p = saveDialog({
      title: 'Export to HTML file',
      defaultPath: this.props.location.query.path,
      filters: [{ name: 'All Files', extensions: ['html'] }],
    })
    if (!p) {
      return
    }

    const { addAlert } = this.props

    const htmlContent = this.getHTMLOutput()

    await fsWriteFile(p, htmlContent)
    addAlert('Successfully exported HTML', 'success')
    this._filelist.refresh()
  }

  handleScreenshot = async () => {
    const { preview, previewSize, addAlert, location } = this.props

    const filename = pathModule.basename(this.state.activeFile.name, '.mjml')

    const [mobileWidth, desktopWidth] = [previewSize.get('mobile'), previewSize.get('desktop')]

    const [mobileScreenshot, desktopScreenshot] = await Promise.all([
      takeScreenshot(preview.content, mobileWidth),
      takeScreenshot(preview.content, desktopWidth),
    ])

    await Promise.all([
      fsWriteFile(pathModule.join(location.query.path, `${filename}-mobile.png`), mobileScreenshot),
      fsWriteFile(
        pathModule.join(location.query.path, `${filename}-desktop.png`),
        desktopScreenshot,
      ),
    ])

    addAlert('Successfully saved mobile and desktop screenshots', 'success')
    this._filelist.refresh()
  }

  openSettingsModal = () => this.props.openModal('settings')
  openSendModal = () => this.props.openModal('send')
  openAddFileModal = () => this.props.openModal('addFile')

  getHTMLOutput() {
    const { preview, beautifyOutput } = this.props
    return beautifyOutput ? beautifyJS.html(preview.content) : preview.content
  }

  refreshFiles = () => {
    this._explorer.refresh()
  }

  render() {
    const { openTab, focusedFilePath } = this.props

    const { activeFile } = this.state

    const rootPath = this.props.location.query.path
    const projectName = pathModule.basename(rootPath)

    return (
      <div className="fg-1 d-f fd-c">
        <ProjectToolbar
          projectName={projectName}
          projectPath={rootPath}
          activeFile={activeFile}
          onFilesRefresh={this.refreshFiles}
        />

        <div className="fg-1 d-f fd-c o-n" tabIndex={0} ref={n => (this._page = n)}>
          <SplitPane defaultSize={200} minSize={0}>
            <FileExplorer
              setRef={n => (this._explorer = n)}
              base={rootPath}
              onFileClick={p => openTab(p)}
              focusedFilePath={focusedFilePath}
            />
            <div className="sticky fg-1 d-f fd-c bg-darker">
              <FileTabs />
              <div className="fg-1 r">
                <TabContent />
              </div>
            </div>
          </SplitPane>

          <SendModal />
          <RemoveFileModal rootPath={rootPath} onRemove={this.handleRemoveFile} />
        </div>
      </div>
    )
  }
}

export default ProjectPage
