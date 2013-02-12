cd jam
r.js -o paths.requireLib=../require baseUrl=. name=jam include=requireLib out=../jam-built.js
cd ..
echo 'require(["jam"], main);' >> jam-built.js
