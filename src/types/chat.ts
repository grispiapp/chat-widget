import { ENVIRONMENTS } from "@lib/config";

export interface GrispiChatOptions {
  /**
   * Unique identifier for the tenant on the {tenantId}.grispi.com domain.
   */
  tenantId: string;

  /**
   * Optional. Query selector for the HTML element where the chat will be mounted.
   * If not provided, it will be created automatically in the body.
   */
  element?: string;

  /**
   * Configuration for the colors used in the chat interface.
   */
  colors: {
    primary: string;
  };

  /**
   * Configuration for the chat agent's details.
   */
  agent: {
    /**
     * Name of the chat agent.
     */
    name: string;

    /**
     * URL or path to the avatar image for the chat agent.
     */
    avatar: string;
  };

  /**
   * Welcome message displayed when the chat is initialized.
   */
  welcome_message: string;

  /**
   * Popup message displayed on the first page load.
   */
  popup_message: string;

  /**
   * Optional. Specifies the environment in which the chat is running.
   * Should be one of the values defined in the ENVIRONMENTS object.
   */
  environment?: keyof typeof ENVIRONMENTS;

  /**
   * Optional. If set to true, enables debug mode for additional logging and debugging information.
   */
  debug?: boolean;
}
