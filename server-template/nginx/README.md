# xcf-nginx

## Compile

    bash build.sh

The nginx binary is now at ./nginx-[os|arm|linux]. In case its a x32 build, it adds the "_32" suffix to the binary.

## Remarks

- the folder ./all contains an example nginx configuration to run PHP via cgi
  