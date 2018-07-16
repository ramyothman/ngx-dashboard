FROM microsoft/aspnetcore:2.0-nanoserver-sac2016 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0-nanoserver-sac2016 AS build
WORKDIR /src
COPY Festo.Dashboard.Api/Festo.Dashboard.Api.csproj Festo.Dashboard.Api/
RUN dotnet restore Festo.Dashboard.Api/Festo.Dashboard.Api.csproj
COPY . .
WORKDIR /src/Festo.Dashboard.Api
RUN dotnet build Festo.Dashboard.Api.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish Festo.Dashboard.Api.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Festo.Dashboard.Api.dll"]
