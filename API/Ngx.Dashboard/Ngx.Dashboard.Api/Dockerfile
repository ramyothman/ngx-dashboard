FROM microsoft/aspnetcore:2.0-nanoserver-sac2016 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0-nanoserver-sac2016 AS build
WORKDIR /src
COPY Ngx.Dashboard.Api/Ngx.Dashboard.Api.csproj Ngx.Dashboard.Api/
RUN dotnet restore Ngx.Dashboard.Api/Ngx.Dashboard.Api.csproj
COPY . .
WORKDIR /src/Ngx.Dashboard.Api
RUN dotnet build Ngx.Dashboard.Api.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish Ngx.Dashboard.Api.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Ngx.Dashboard.Api.dll"]
