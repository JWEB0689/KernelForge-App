# KernelForge

KernelForge is a mobile application built with Next.js and Capacitor, designed to streamline and automate Android custom kernel development and packaging directly from your device.

## Overview
This application serves as a comprehensive dashboard and toolkit for Android modders and kernel developers. Instead of relying heavily on manual terminal compilation, KernelForge allows you to visually orchestrate:
- **Automated Kernel Patching**: Easily configure customized kernel builds for modern Android devices. Integrate critical root and filesystem hiding frameworks like KernelSU, SUSFS, and NoMount seamlessly into your kernel source.
- **AnyKernel3 Packaging**: Avoid manually copying `Image.lz4` files around. The system helps you output completed, flashable AnyKernel3 ZIPs that are immediately ready for custom recovery installation.
- **AI-Powered Log Analysis**: An integrated AI troubleshooter module that can quickly scan messy log outputs for KMI/GKI compatibility issues, failed patch hooks, and missing dependencies, saving hours of debugging time.

## Mobile Native Architecture
KernelForge is a locally installable Android app (ARM64). It leverages a Capacitor wrapper around a statically exported Next.js frontend to give you full standalone functionality directly on your phone.
- Web Framework: **Next.js 15**
- Native Bridge: **Capacitor 6**

## Local Development
- `npm run dev` to start a browser-based development layout.

## Automated APK Builds & Releases
This repository is configured with a complete GitHub Actions CI/CD pipeline. 
Whenever a new version tag (e.g., `v1.0.0`) is pushed to this repository, GitHub Actions will:
1. Compile the Next.js static payload.
2. Inject it into the Android Capacitor wrapper.
3. Automatically build, align, and sign the `arm64-v8a` APK.
4. Publish the finished APK right to the "Releases" page for easy downloading and sideloading.