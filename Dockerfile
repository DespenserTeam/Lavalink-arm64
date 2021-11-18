FROM eclipse-temurin:17

# Run as non-root user
RUN groupadd -g 322 lavalink && \
  useradd -r -u 322 -g lavalink lavalink
USER lavalink

WORKDIR /opt/Lavalink

COPY LavalinkPatch.jar Lavalink.jar

ENTRYPOINT ["java", "-Djdk.tls.client.protocols=TLSv1.1,TLSv1.2", "-Xmx4G", "-jar", "Lavalink.jar"]
