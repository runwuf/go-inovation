set -e

name=innovation2007
app_name=Innovation2007.app
bundle_id=com.hajimehoshi.innovation2007.macos
mkdir -p bin

rm -rf bin/${app_name}
mkdir -p bin/${app_name}/Contents/MacOS
mkdir -p bin/${app_name}/Contents/Resources
go build -tags=steam -o bin/${app_name}/Contents/MacOS/${name} .
cp steam/icon/icon_512x512.icns bin/${app_name}/Contents/Resources/icon.icns
echo '<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleExecutable</key>
    <string>{{.Name}}</string>
    <key>CFBundleIdentifier</key>
    <string>{{.BundleID}}</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>NSHighResolutionCapable</key>
    <true />
    <key>LSMinimumSystemVersion</key>
    <string>10.13.0</string>
  </dict>
</plist>' |
    sed -e "s/{{.Name}}/${name}/g" |
    sed -e "s/{{.BundleID}}/${bundle_id}/g" > bin/${app_name}/Contents/Info.plist
# Note: In order to open the *.app, steam_appid.txt should be copied to *.app/Contents/Resources.
# However, this file should not be copied when you submit the app.
