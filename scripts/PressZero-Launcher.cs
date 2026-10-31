using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace PressZero {
    static class Program {
        [STAThread]
        static void Main(string[] args) {
            try {
                // Determine target URL: either local offline app if bundled, or production/localhost URL
                string localApp = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app", "index.html");
                string targetUrl = File.Exists(localApp) 
                    ? "file:///" + localApp.Replace("\\", "/") 
                    : "https://presszero.app/studio";

                // Allow override via CLI argument
                if (args.Length > 0 && !string.IsNullOrEmpty(args[0])) {
                    targetUrl = args[0];
                }

                // Locate Edge or Chrome on Windows
                string[] candidates = new string[] {
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
                };

                string browserExe = null;
                foreach (string candidate in candidates) {
                    if (File.Exists(candidate)) {
                        browserExe = candidate;
                        break;
                    }
                }

                if (browserExe != null) {
                    Process.Start(new ProcessStartInfo {
                        FileName = browserExe,
                        Arguments = "--app=\"" + targetUrl + "\" --new-window --window-size=1280,850",
                        UseShellExecute = true
                    });
                } else {
                    // Fallback to default shell handler
                    Process.Start(new ProcessStartInfo {
                        FileName = targetUrl,
                        UseShellExecute = true
                    });
                }
            } catch (Exception ex) {
                MessageBox.Show("Could not launch PressZero: " + ex.Message, "PressZero Desktop Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
