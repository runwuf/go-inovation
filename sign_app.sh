set -e

name=innovation2007
app_name=Innovation2007.app
zip_name=Innovation2007.zip
bundle_id=com.hajimehoshi.innovation2007.macos
email=hajimehoshi@gmail.com

# Specify a 'Developer ID' (Developer ID Application) certificate.
# See https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues
developer_name='Developer ID Application: Hajime Hoshi (M89F6KFPW7)'

# To get the provider, run `xcrun altool --list-providers --username=<USER NAME> --password=<APP PASSWORD>` and see the ProviderShortname.
asc_provider=M89F6KFPW7

# macOS: signing
# See
# * https://partner.steamgames.com/doc/store/application/platforms
# * https://coldandold.com/posts/releasing-steam-game-on-mac/

echo '<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.disable-library-validation</key>
     <true/>
     <key>com.apple.security.cs.allow-dyld-environment-variables</key>
     <true/>
  </dict>
</plist>' > bin/entitlements.plist

codesign --display \
         --verbose \
         --verify \
         --sign "${developer_name}" \
         --timestamp \
         --options runtime \
         --force \
         --entitlements bin/entitlements.plist \
         --deep \
         bin/${app_name}

/usr/bin/ditto -c -k --keepParent bin/${app_name} bin/${zip_name}

if [[ -z "${APP_PASSWORD}" ]]; then
    echo 'fail: set APP_PASSWORD. See https://support.apple.com/en-us/HT204397'
    exit 1
fi

xcrun altool --notarize-app \
             --primary-bundle-id "${bundle_id}" \
             --username "${email}" \
             --password "${APP_PASSWORD}" \
             --asc-provider "${asc_provider}" \
             --file bin/${zip_name}

echo "Please wait for an email from Apple."
echo "For the log, run this command: xcrun altool --notarization-info <UUID> --username <USER NAME> --password <APP PASSWORD>"
echo "Run this command later: xcrun stapler staple bin/${app_name}"
