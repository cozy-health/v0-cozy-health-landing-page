import { defineRailway, preserve, project, service } from "railway/iac";

export const partial = "cozy-health-website";

export default defineRailway((context) => {
  if (context.projectId !== "33f9a938-49e3-42c5-83c7-633ee85760fa" || context.environmentId !== "9ffd3fd1-ae52-4cc7-903e-35b529a151ae") {
    throw new Error("The reviewed CozyHealth production environment is required.");
  }

  const application = service("cozy-health-website", {
    env: {
      "COZY_DEPLOYMENT_ENV": preserve(),
      "NEXT_PUBLIC_POSTHOG_KEY": preserve(),
    },
    "source": {
        "branch": "main",
        "checkSuites": true,
        "repo": "cozy-health/v0-cozy-health-landing-page",
        "type": "github"
      },
      "build": {
        "buildEnvironment": "V3",
        "builder": "DOCKERFILE",
        "dockerfilePath": "Dockerfile"
      },
      "deploy": {
        "healthcheckPath": "/",
        "ipv6EgressEnabled": false,
        "multiRegionConfig": {
          "sfo": {
            "numReplicas": 1
          }
        },
        "runtime": "V2",
        "useLegacyStacker": false,
        "healthcheckTimeout": 120,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 3
      },
      "networking": {
        "customDomains": {
          "cozyhealth.org": {
            "port": 8080
          },
          "www.cozyhealth.org": {
            "port": 8080
          }
        },
        "serviceDomains": {
          "cozy-health-website-production-a679.up.railway.app": {
            "port": 8080
          }
        }
      }
  });

  return project("celebrated-flexibility", { resources: [application] });
});
