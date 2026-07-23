import java.util.Properties

plugins {
    id("com.android.application")
}

val repositoryRoot = projectDir.resolve("../../../..").canonicalFile
val generatedWebAssets = layout.buildDirectory.dir("generated/webAssets")
val signingPropertiesFile = rootProject.file("keystore.properties")
val signingProperties = Properties().apply {
    if (signingPropertiesFile.isFile) {
        signingPropertiesFile.inputStream().use(::load)
    }
}
val releaseSigningAvailable = signingPropertiesFile.isFile

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
        versionCode = 2
        versionName = "0.1.1"
    }

    signingConfigs {
        if (releaseSigningAvailable) {
            create("release") {
                storeFile = file(signingProperties.getProperty("storeFile"))
                storePassword = signingProperties.getProperty("storePassword")
                keyAlias = signingProperties.getProperty("keyAlias")
                keyPassword = signingProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            if (releaseSigningAvailable) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
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

tasks.matching { it.name == "packageRelease" || it.name == "bundleRelease" }.configureEach {
    doFirst {
        check(releaseSigningAvailable) {
            "Crie android/keystore.properties fora do Git antes de gerar uma versão release."
        }
    }
}

dependencies {
    implementation("androidx.activity:activity:1.13.0")
    implementation("androidx.webkit:webkit:1.16.0")
    implementation("com.github.mik3y:usb-serial-for-android:3.11.0")
}
