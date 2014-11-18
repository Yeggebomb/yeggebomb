FROM google/cloud-sdk

# Install all the packages that Scorched Sphere depends on
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update
RUN apt-get install -y \
  nodejs \
  nodejs-legacy \
  build-essential \
  ruby-full
RUN gem install compass sass
RUN npm install -g grunt-cli

# Set up and switch to the yegge user
RUN useradd -m yegge
USER yegge
ENV USER yegge
ENV HOME /home/yegge

# Download and install Closure Compiler
WORKDIR /home/yegge
RUN mkdir compiler-latest
RUN wget http://dl.google.com/closure-compiler/compiler-latest.zip
RUN unzip compiler-latest.zip -d compiler-latest/build
ENV CLOSURE_PATH /home/yegge/compiler-latest

# Run local build steps
RUN mkdir /home/yegge/bomb
WORKDIR /home/yegge/bomb
COPY \
  README.md \
  package.json \
  Gruntfile.js \
  build.sh \
  /home/yegge/bomb/
RUN npm install
RUN ln -s /workspace/src src
ENV GOPATH /home/yegge/bomb/src

ENTRYPOINT ./build.sh && goapp serve -host=0.0.0.0 src
