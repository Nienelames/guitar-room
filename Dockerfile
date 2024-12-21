FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GuitarRoom.csproj", "./"]
RUN dotnet restore "GuitarRoom.csproj"

COPY . .
WORKDIR "/src/"
RUN dotnet build "GuitarRoom.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GuitarRoom.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
USER root
RUN mkdir /app/db
RUN chmod -R 777 /app/db
RUN chown -R $APP_UID:$APP_UID /app/db
USER $APP_ID
ENTRYPOINT ["dotnet", "GuitarRoom.dll"]

