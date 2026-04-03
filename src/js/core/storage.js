// Unified workspace persistence for autosave, project restore, and session backup.
(function() {
  'use strict';

  var WORKSPACE_BACKUP_KEY = 'bipes_workspace_backup';
  var WORKSPACE_BACKUP_TS_KEY = 'bipes_workspace_backup_ts';
  var PROJECTS_KEY = 'bipes_projects';
  var LAST_PROJECT_KEY = 'bipes_last_project_uid';
  var saveTimeout = null;
  var listenerBound = false;
  var suppressSave = false;
  var startupRestoreState = '';

  function getWorkspace() {
    if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) {
      return null;
    }
    return Blockly.getMainWorkspace();
  }

  function isPrettyXml(xmlText) {
    return typeof xmlText === 'string' && xmlText.indexOf('\n') !== -1;
  }

  function readProjects() {
    try {
      var raw = localStorage.getItem(PROJECTS_KEY);
      if (!raw) {
        return {};
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      console.error('[SimpleStorage] Failed to read projects:', e);
      return {};
    }
  }

  function writeProjects(projects) {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects || {}));
    } catch (e) {
      console.error('[SimpleStorage] Failed to write projects:', e);
    }
  }

  function serializeWorkspace(prettyText) {
    try {
      var workspace = getWorkspace();
      if (!workspace) {
        return '';
      }

      var xmlDom = Blockly.Xml.workspaceToDom(workspace);
      var xmlText = prettyText
        ? Blockly.Xml.domToPrettyText(xmlDom)
        : Blockly.Xml.domToText(xmlDom);

      if (window.UI && UI['workspace'] && typeof UI['workspace'].writeWorkspace === 'function') {
        return UI['workspace'].writeWorkspace(xmlText, !!prettyText);
      }

      return xmlText;
    } catch (e) {
      console.error('[SimpleStorage] Serialize error:', e);
      return '';
    }
  }

  function prepareWorkspaceXml(xmlText) {
    try {
      if (!xmlText) {
        return '';
      }

      if (window.UI && UI['workspace'] && typeof UI['workspace'].readWorkspace === 'function') {
        return UI['workspace'].readWorkspace(xmlText, isPrettyXml(xmlText));
      }

      return xmlText;
    } catch (e) {
      console.error('[SimpleStorage] Metadata parse error:', e);
      return xmlText;
    }
  }

  function setCurrentProject(uid, xmlText) {
    if (!window.UI || !UI['account']) {
      return;
    }

    UI['account'].currentProject.uid = uid || '';
    UI['account'].currentProject.xml = xmlText || '';
  }

  function markCurrentProjectInList(uid) {
    if (!window.UI || !UI['account'] || !UI['account'].projectList) {
      return;
    }

    var currentNode = UI['account'].projectList.querySelector('.current');
    if (currentNode) {
      currentNode.className = '';
    }

    var projectNode = UI['account'].projectList.querySelector('#' + uid);
    if (projectNode) {
      projectNode.className = 'current';
    }
  }

  function rememberCurrentProject(uid, timestamp) {
    if (!uid) {
      return;
    }

    var projects = readProjects();
    projects[uid] = timestamp || (+new Date());
    writeProjects(projects);

    if (window.UI && UI['account']) {
      UI['account'].projects = projects;
    }

    try {
      localStorage.setItem(LAST_PROJECT_KEY, uid);
    } catch (e) {
      console.error('[SimpleStorage] Failed to remember current project:', e);
    }
  }

  function clearCurrentProjectMemory(uid) {
    try {
      if (localStorage.getItem(LAST_PROJECT_KEY) === uid) {
        localStorage.removeItem(LAST_PROJECT_KEY);
      }
    } catch (e) {
      console.error('[SimpleStorage] Failed to clear last project key:', e);
    }
  }

  function getLastProjectUid(projects) {
    projects = projects || readProjects();

    try {
      var explicitUid = localStorage.getItem(LAST_PROJECT_KEY);
      if (explicitUid && projects[explicitUid] && localStorage.getItem(explicitUid)) {
        return explicitUid;
      }
    } catch (e) {
      console.error('[SimpleStorage] Failed to read last project key:', e);
    }

    var latestUid = '';
    var latestTimestamp = -1;
    Object.keys(projects).forEach(function(uid) {
      if (!localStorage.getItem(uid)) {
        return;
      }
      var timestamp = Number(projects[uid]) || 0;
      if (timestamp >= latestTimestamp) {
        latestUid = uid;
        latestTimestamp = timestamp;
      }
    });

    return latestUid;
  }

  function loadWorkspaceFromText(xmlText) {
    try {
      var workspace = getWorkspace();
      if (!workspace || !xmlText) {
        return false;
      }

      var preparedXml = prepareWorkspaceXml(xmlText);
      if (!preparedXml) {
        return false;
      }

      suppressSave = true;
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(preparedXml), workspace);
      return true;
    } catch (e) {
      console.error('[SimpleStorage] Load error:', e);
      return false;
    } finally {
      window.setTimeout(function() {
        suppressSave = false;
      }, 0);
    }
  }

  function saveWorkspaceBackup() {
    try {
      var xmlText = serializeWorkspace(true);
      if (!xmlText) {
        return false;
      }
      localStorage.setItem(WORKSPACE_BACKUP_KEY, xmlText);
      localStorage.setItem(WORKSPACE_BACKUP_TS_KEY, String(+new Date()));
      return true;
    } catch (e) {
      console.error('[SimpleStorage] Backup save error:', e);
      return false;
    }
  }

  function saveCurrentProject() {
    try {
      if (!window.UI || !UI['account'] || !UI['account'].currentProject.uid) {
        return false;
      }

      var uid = UI['account'].currentProject.uid;
      var xmlText = serializeWorkspace(true);
      if (!xmlText) {
        return false;
      }

      localStorage.setItem(uid, xmlText);
      rememberCurrentProject(uid, +new Date());
      setCurrentProject(uid, xmlText);
      return true;
    } catch (e) {
      console.error('[SimpleStorage] Project save error:', e);
      return false;
    }
  }

  function saveAll() {
    if (suppressSave) {
      return false;
    }
    var backupSaved = saveWorkspaceBackup();
    var projectSaved = saveCurrentProject();
    return backupSaved || projectSaved;
  }

  function restoreProjectList() {
    var projects = readProjects();
    if (window.UI && UI['account'] && typeof UI['account'].restoreProjects === 'function') {
      UI['account'].restoreProjects(projects);
    }
    return projects;
  }

  function openProjectByUid(uid) {
    if (!uid) {
      return false;
    }

    var xmlText = localStorage.getItem(uid);
    if (!xmlText) {
      return false;
    }

    if (!loadWorkspaceFromText(xmlText)) {
      return false;
    }

    rememberCurrentProject(uid, +new Date());
    setCurrentProject(uid, xmlText);
    markCurrentProjectInList(uid);
    return true;
  }

  function createProject(uid, xmlText) {
    if (!uid || !xmlText) {
      return false;
    }

    try {
      localStorage.setItem(uid, xmlText);
    } catch (e) {
      console.error('[SimpleStorage] Failed to create project:', e);
      return false;
    }

    rememberCurrentProject(uid, +new Date());
    setCurrentProject(uid, xmlText);
    markCurrentProjectInList(uid);
    return loadWorkspaceFromText(xmlText);
  }

  function deleteProject(uid) {
    if (!uid) {
      return;
    }

    try {
      localStorage.removeItem(uid);
    } catch (e) {
      console.error('[SimpleStorage] Failed to delete project XML:', e);
    }

    var projects = readProjects();
    delete projects[uid];
    writeProjects(projects);
    clearCurrentProjectMemory(uid);

    if (window.UI && UI['account']) {
      UI['account'].projects = projects;
      if (UI['account'].currentProject.uid === uid) {
        setCurrentProject('', '');
      }
    }
  }

  function restoreLastSession() {
    if (startupRestoreState) {
      return startupRestoreState;
    }

    var projects = restoreProjectList();
    var backupXml = localStorage.getItem(WORKSPACE_BACKUP_KEY);
    if (backupXml && loadWorkspaceFromText(backupXml)) {
      if (window.Files && typeof Files.handleCurrentProject === 'function') {
        Files.handleCurrentProject();
      }
      startupRestoreState = 'backup';
      return startupRestoreState;
    }

    var lastProjectUid = getLastProjectUid(projects);
    if (lastProjectUid && openProjectByUid(lastProjectUid)) {
      if (window.Files && typeof Files.handleCurrentProject === 'function') {
        Files.handleCurrentProject();
      }
      startupRestoreState = 'project';
      return startupRestoreState;
    }

    startupRestoreState = '';
    return '';
  }

  function shouldSaveEvent(event) {
    if (!event) {
      return true;
    }
    if (typeof Blockly === 'undefined' || !Blockly.Events) {
      return true;
    }
    return event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_MOVE;
  }

  function setupAutoSave() {
    var workspace = getWorkspace();
    if (!workspace || !window.UI || !UI['account']) {
      window.setTimeout(setupAutoSave, 500);
      return;
    }

    restoreLastSession();

    if (listenerBound) {
      return;
    }

    listenerBound = true;
    workspace.addChangeListener(function(event) {
      if (!shouldSaveEvent(event) || suppressSave) {
        return;
      }

      window.clearTimeout(saveTimeout);
      saveTimeout = window.setTimeout(saveAll, 500);
    });
  }

  window.addEventListener('beforeunload', saveAll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoSave);
  } else {
    setupAutoSave();
  }

  window.SimpleStorage = {
    createProject: createProject,
    deleteProject: deleteProject,
    getLastProjectUid: getLastProjectUid,
    getStartupRestoreState: function() { return startupRestoreState; },
    loadWorkspaceFromText: loadWorkspaceFromText,
    openProjectByUid: openProjectByUid,
    readProjects: readProjects,
    restoreLastSession: restoreLastSession,
    restoreProjectList: restoreProjectList,
    save: saveAll,
    saveCurrentProject: saveCurrentProject,
    saveWorkspaceBackup: saveWorkspaceBackup
  };
})();
