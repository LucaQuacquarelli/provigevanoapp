. $(dirname "$0")/config.sh

echo "Building app . . ."
npm run build
echo "Build Completed"

#RUN THIS COMMAND ONLY FIRST TIME
# echo "Adding OS . . ."
# npx cap add $OS
# echo $OS "Added Successfully"

echo "Copying files . . ."
npx cap copy
echo "DONE !!!"

npx cap open $OS

echo "Launching" $OS "App . . ."