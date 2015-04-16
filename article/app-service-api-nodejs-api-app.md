<properties
	pageTitle="Build and deploy a Node.js API App in Azure App Service"
	description="Learn how to create a Node.js API app package and deploy it to Azure App Service."
	services="app-service\api"
	documentationCenter=".net"
	authors="pakefali"
  manager="",
  editor=""/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/16/2015"
	ms.author="pakefali"/>

# Build and deploy a Node.js API App in Azure App Service

This tutorial shows you how to create a [Node.js](http://nodejs.org) application and deploy it to Azure App Service API Apps using [Git](http://git-scm.com). The instructions in this tutorial can be followed on any operating system that is capable of running Node.

A screenshot of the completed application is below:

## Create an API App and enable Git publishing

> [WACOM.NOTE] To complete this tutorial, you need an Microsoft Azure account. If you don't have an account, you can [activate your MSDN subscriber benefits](/en-us/pricing/member-offers/msdn-benefits-details/) or [sign up for a free trial](/en-us/pricing/free-trial/).
 You can also try for free [App Service App Samples](http://tryappservice.azure.com).

Log in to the [Azure Portal](https://portal.azure.com).

Click the **+ NEW** icon on the bottom left of the portal

Click **Web + Mobile**, then **API App**.

![][portal-quick-create]

Enter a value for **Name**.

Select an App Service plan or create a new one. If you create a new plan, select the pricing tier, location, and other options.

![][portal-create-api]

Click **Create**. Once the status changes to **Running**, the portal will automatically open the blade for your API App.

![][api-app-blade]

Click on the **API App host** tile in the API App blade.

![][api-app-host]

Find the **Deployment** section of the API App blade. (You may need to scroll to see this part of the blade.)

![][deployment-part]

Click on **All Settings**, then **Application Settings**. Set the Access level to **Public (anonymous)** and click **Save**.

![][set-api-app-access-level]

Click **Choose Source**, then **Local Git Repository**. Click **OK**.

![][setup-git-publishing]

Click at **Set deployment credentials**. Create a user name and password. Click **Save**. (If you have previously enabled publishing for an API App or any other App Service App, you don't need to do this step.)

![][deployment-credentials]

To publish, you will push to a Git remote repository. Find the URL for repository, click **All Settings**, then click **Properties**. The URL is listed under "GIT URL".

![][git-url]

## Create a Node.js API App

In this section, we will take a look at the code provided as part of the NodeAPIApp sample.

> [WACOM.NOTE] To complete this tutorial you will need to clone the code in [this GitHub repository](http://go.microsoft.com/fwlink/?LinkID=534023&clcid=0x409) or download the .zip file containing the code in the repository. Node.js API App sample and unzip it in your local disk. 

Azure App Service has two prerequisites in order to recognize a Node.js application as an API App:

+ A file named **apiapp.json** has to be present in the root directory of the application
+ A **Swagger 2.0** metadata endpoint should be exposed by the application

> [WACOM.NOTE] It's important to remember that the endpoint has to be of Swagger 2.0 specification, as older versions (e.g. 1.2) are not supported by the platform and the API App will not function correctly. The sample application is using swaggerize-express to create a Swagger 2.0 specification endpoint.

Navigate to the folder were you unzipped the sample.

![][api-app-folder-browse]

Use your text editor and inspect the **apiapp.json** file.

![][apiapp-json]

Take note of the **apiDefinition** json property. This path is relative to your deployment's URL and it points to the Swagger 2.0 endpoint. Azure App Service is using this property to discover the definition of your API and enable all the Azure App Service capabilities.

Use your text editor and inspect the **server.js** file.

![][server-js]

As part of the code, we're using the swaggerize-express module and we are filling the required properties for it to work.

app.use(swaggerize({
    api: require('./api.json'),
    docspath: '/swagger',
    handlers: './handlers/'
}));

The _api_ property points to the api.json file which contains the Swagger 2.0 spec definition of our API.
> [WACOM.NOTE] You can manually create the file in a text editor or use the online [editor of Swagger](http://editor.swagger.io) and download the JSON file from there.

The _docspath_ property points to the Swagger 2.0 endpoint and it's relative to the base path of your API. The base path is declared in the api.json file. In our example the base path is _/api/data_.
> [WACOM.NOTE] As the base path is declared in the api.json file, trying to access the /swagger endpoint as a relative path to your API App's URL will return 404. This is a common mistake when trying to access the swagger endpoint.

The _handlers_ property points to the local folder that contains the route handlers for the Express.js module.

### Summary of this section

We have explained the files required by the platform in order to recognize a Node.js app as an API App. We also explained how you can build the Swagger 2.0 spec file and we reviewed the one provided with the sample. Lastly, we took a look on how we wire things together in our _server.js_ and explained each one of the required properties.

## Run the API App locally

In this section we're going to run the application locally to verify it works prior to deployment.

1. Navigate to the folder were you downloaded the sample.
2. Open command line prompt and write the following

    	node server.js

3. The output should be "Server started.."
4. Navigate your browser to http://localhost:1337/
5. You should see the sample page

![][sample-api-app-page]

You can also view the Swagger.json file by navigating to http://localhost:1337/api/data/swagger.

## Publish your API App to Azure App Service

From the command-line, change directories to the sample application directory and enter the following commands to initialize a local Git repository.

	git init

> [WACOM.NOTE] **Git command unavailable?**
[Git](http://git-scm.com/%20target="_blank) is a distributed version control system that you can use to deploy your Azure Website. For installation instructions for your platform, see [the Git download page](http://git-scm.com/download%20target="_blank").

Use the following commands to add files to the repository:

	git add .
	git commit -m "Initial commit of the API App"

Add a Git remote for pushing updates to the web app you created previously, using the following command:

	git remote add azure [URL for remote repository]

Push your changes to Azure using the following command:

	git push azure master

You will be prompted for the password you created earlier. The output should be similar to the following:

	Counting objects: 3, done.
	Delta compression using up to 8 threads.
	Compressing objects: 100% (2/2), done.
	Writing objects: 100% (3/3), 374 bytes, done.
	Total 3 (delta 0), reused 0 (delta 0)
	remote: New deployment received.
	remote: Updating branch 'master'.
	remote: Preparing deployment for commit id '5ebbe250c9'.
	remote: Preparing files for deployment.
	remote: Deploying Web.config to enable Node.js activation.
	remote: Deployment successful.
	To https://user@testsite.scm.azurewebsites.net/testsite.git
	 * [new branch]      master -> master

To view your app, click the **Browse** button on the **API App** part within the management portal.

![][browse-api-app-page]

##Additional Resources

* You can try this sample API App at [TryApp Service](http://tryappservice.azure.com)

[portal-quick-create]: ./media/app-service-api-nodejs-api-app/portal-quick-create.png
[portal-create-api]: ./media/app-service-api-nodejs-api-app/portal-create-api.png
[api-app-blade]: ./media/app-service-api-nodejs-api-app/api-app-blade.png
[api-app-folder-browse]: ./media/app-service-api-nodejs-api-app/api-app-folder-browse.png
[api-app-host]: ./media/app-service-api-nodejs-api-app/api-app-host.png
[deployment-part]: ./media/app-service-api-nodejs-api-app/continuous-deployment.png
[set-api-app-access-level]: ./media/app-service-api-nodejs-api-app/set-api-app-access.png
[setup-git-publishing]: ./media/app-service-api-nodejs-api-app/local-git-repo.png
[deployment-credentials]: ./media/app-service-api-nodejs-api-app/deployment-credentials.png
[git-url]: ./media/app-service-api-nodejs-api-app/git-url.png
[apiapp-json]: ./media/app-service-api-nodejs-api-app/apiapp-json.png
[server-js]: ./media/app-service-api-nodejs-api-app/server-js.png
[sample-api-app-page]: ./media/app-service-api-nodejs-api-app/sample-api-app-page.png
[browse-api-app-page]: ./media/app-service-api-nodejs-api-app/browse-api-app-page.png
