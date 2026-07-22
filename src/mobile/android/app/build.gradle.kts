plugins {
    id("com.android.application")
}

val repositoryRoot = projectDir.resolve("../../../..").canonicalFile
val generatedWebAssets = layout.buildDirectory.dir("generated/webAssets")

val prepareWebAssets by tasks.registering(Sync::class) {
    group = "build"
    description = "Empacota a plataforma web existente sem alterar os arquivos fonte."

    into(generatedWebAssets)
    from(repositoryRoot.resolve("src")) {
        into("src")
        exclude("mobile/**")
    }
    from(repositoryRoot.resolve("device-file-manager")) {
        into("device-file-manager")
    }
}

android {
    namespace = "org.bitdoglab.bipes"
    compileSdk = 36

    defaultConfig {
        applicationId = "org.bitdoglab.bipes"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"
    }

    sourceSets {
        getByName("main").assets.srcDir(generatedWebAssets)
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

tasks.named("preBuild").configure {
    dependsOn(prepareWebAssets)
}

dependencies {
    implementation("androidx.activity:activity:1.13.0")
    implementation("androidx.webkit:webkit:1.16.0")
    implementation("com.github.mik3y:usb-serial-for-android:3.11.0")
}
