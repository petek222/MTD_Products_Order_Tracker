FROM node:11.12-stretch
copy . /opt/app/
copy package.json /opt/app/
WORKDIR /opt/app

run npm install

#INSTALL LIBAIO1 & UNZIP (NEEDED FOR STRONG-ORACLE)
RUN apt-get update \
 && apt-get install -y libaio1 \
 && apt-get install -y build-essential \
 && apt-get install -y unzip \
 && apt-get install -y curl

#Add and install ORACLE INSTANT CLIENT
ADD ./vendor/ /opt/oracle/vendor
RUN  unzip /opt/oracle/vendor/instantclient-basiclite-linux.x64-18.3.0.0.0dbru.zip -d /opt/oracle \
  && unzip /opt/oracle/vendor/instantclient-sqlplus-linux.x64-18.3.0.0.0dbru.zip -d /opt/oracle  \
  && mv /opt/oracle/instantclient_18_3 /opt/oracle/instantclient \
  && rm -rf /opt/oracle/vendor 
run rm /opt/oracle/instantclient/libclntsh.so
run ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so
ENV MTD_DOCKER_VER=$DOCKER_VER
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_HOME="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INCLUDE_DIR="/opt/oracle/instantclient/sdk/include"
RUN echo '/opt/oracle/instantclient/' | tee -a /etc/ld.so.conf.d/oracle_instant_client.conf && ldconfig
run ls -l /opt/oracle
#EXPOSE 3000
CMD node app.js
