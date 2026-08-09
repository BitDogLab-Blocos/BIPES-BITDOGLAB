'use strict';

var Code = window.Code || (window.Code = {});
var WorkspaceManager = window.WorkspaceManager || (window.WorkspaceManager = {});

Code.loadBlocks = WorkspaceManager.loadBlocks;
Code.filterToolboxByProject = WorkspaceManager.filterToolboxByProject;
Code.PROJECT_NAMES = WorkspaceManager.PROJECT_NAMES;
Code.initProjectSelector = WorkspaceManager.initProjectSelector;
Code.localizeRuntimePanel = WorkspaceManager.localizeRuntimePanel;
Code.showJoystickGetterReminder = WorkspaceManager.showJoystickGetterReminder;
Code.showJoystickSeletorReminder = WorkspaceManager.showJoystickSeletorReminder;
Code.showMicGetterReminder = WorkspaceManager.showMicGetterReminder;
Code.showBarraGetterReminder = WorkspaceManager.showBarraGetterReminder;
Code.showPalmasGetterReminder = WorkspaceManager.showPalmasGetterReminder;
Code.showSensorReminder = WorkspaceManager.showSensorReminder;
Code.showRobotRotationReminder = WorkspaceManager.showRobotRotationReminder;
Code.showRobotAccelerationReminder = WorkspaceManager.showRobotAccelerationReminder;
Code.showRobotInstrumentDisplayReminder = WorkspaceManager.showRobotInstrumentDisplayReminder;
Code.showRobotBatteryVoltageReminder = WorkspaceManager.showRobotBatteryVoltageReminder;
Code.showRobotCurrentReminder = WorkspaceManager.showRobotCurrentReminder;
Code.showEstufaToggleReminder = WorkspaceManager.showEstufaToggleReminder;
Code.showGraficoReminder = WorkspaceManager.showGraficoReminder;
Code.initWorkspace = WorkspaceManager.initWorkspace;
Code.discard = WorkspaceManager.discard;

