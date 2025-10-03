# Variable Tester v2

> The original version was based on [Anion Variable Tester](https://petermacintyre.weebly.com/idiodynamic-software.html)

Variable Tester v2 is a desktop application that allows users to perform variable testing on their computers. It is a complete rewrite of the original [Variable Tester](https://github.com/80113hunterhsu/VariableTester).

## Features
- Rebuilt with Electron + React for better maintainability
- Added SQLite database for data persistence
- Optimized `Experiment` flows, including real-time chart rendering of experiment records, a newly designed score bar, and the ability to modify records after an experiment has ended
- Added a `Results` Page to access experiment results at any time (including charts and data export)
- Added a `Settings` Page to customize experiment parameters and configurations

## Installation

> This application supports Windows and macOS.

1. Go to the [Releases page](https://github.com/80113hunterhsu/variable-tester-v2/releases).
2. Download the installer package for your operating system (Windows or macOS; macOS supports Intel x64 and M-series arm64).
3. Follow the installer instructions to complete installation and launch the application.

**Recommended for macOS users:** Download the `.dmg` file which includes a helper script to remove quarantine.
If using the `.zip` file, run this command after extraction:
```bash
xattr -cr "/Applications/Variable Tester.app"
```
or download the `remove-quarantine.command` script and run it after extraction.

## Usage

Variable Tester v2 provides three main types of usage: `Experiment`, `Result`, and `Settings`.

### 1. Experiment
- Enter the `Experiment` page and click "Start" to begin a new experiment, or click "Settings" to go to the Settings page.
- **Step 1:** Enter the subject name and the variable to be tested to start an experiment session.
- **Step 2:** Experiment instructions are displayed to the subject. Click "Next" to proceed.
- **Step 3:** Choose the video file to use in the experiment (currently supports mp4). Click "Next" after selection.
- **Step 4:** Preview the selected video. If it is incorrect, use the "Back" button to re-select.
- **Step 5:** Conduct the experiment according to the chosen video. A line chart is displayed beside the video in real time, reflecting the scores you modify. A horizontal score bar above the score-changing buttons, below the video and chart, shows the current score. After the video ends or the experiment concludes, click "Next" to proceed to modification.
- **Step 6:** Review the scores from Step 5. You can click on each dot in the chart to change the score at a specific time. When you click a data point, the video replays at that exact moment. After modifications, click "Done" to go to the Result page for that session.

### 2. Result
- In the `Results` page, a list of all available experiment results is displayed. Click on any row to view detailed records for that experiment.
- Each experiment's details include the subject name, tested variable name, experiment date and time, and the selected video. The view also displays the line chart from the experiment session (read-only) and the settings that were applied during that session.

### 3. Settings
- The `Settings` page allows you to customize experiment parameters. Changes are automatically saved after a short delay, and a confirmation message is shown.
- Settings persist across sessions, so configure them before starting an experiment if needed.
- The settings used in each session are recorded and viewable in the corresponding experiment result.
- Available settings:

| Setting | Description | Default | Input Type |
|---------|-------------|---------|------------|
| updateInterval | Score capture interval in milliseconds | 1000 | Number |
| useNotifySound | Play a sound when scores become stale | true | Switch |
| notifySoundVolume | Notification sound volume (0–100) | 10 | Range |
| resetUnit | Points per reset | 1 | Number |
| resetTimeout | Delay before auto-reset in milliseconds | 1000 | Number |
| resetInterval | Time between auto-resets in milliseconds | 1000 | Number |
| isBidirectional | Allow negative scores | true | Switch |
| maxScore | Maximum score (can be negative if bidirectional enabled) | 5 | Number |

## Contributing

Feel free to submit [issues](https://github.com/80113hunterhsu/variable-tester-v2/issues) or [pull requests](https://github.com/80113hunterhsu/variable-tester-v2/pulls) to help improve this project.

## License

This project is licensed under the Apache License 2.0.
