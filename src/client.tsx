/// <reference types="vite/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start-client";
import { getRouter } from "./router";

const router = getRouter();

const Client = StartClient as any;

hydrateRoot(document.getElementById("root") || document, <Client router={router} />);
