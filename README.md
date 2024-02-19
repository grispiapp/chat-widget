# Widget usage

To add the widget to your site, simply copy and paste this code snippet into the </body> section of your website.

Also replace `{TENANT_ID}` with your own **Tenant ID**.

```html
<script src="https://grispi.app/chat-widget/chat-widget.js"></script>
<script>
  GrispiChat.create({
    tenantId: "{TENANT_ID}",
    debug: true,
    // ...options
  });
</script>
```

## Widget Options

```typescript
interface GrispiChatOptions {
  /**
   * Unique identifier for the tenant on the {tenantId}.grispi.com domain.
   */
  tenantId: string;

  /**
   * Optional. Language code for the chat interface.
   *
   * Preferred language priority:
   *  1. window.GrispiChat.options.language,
   *  2. document.documentElement.lang,
   *  3. FALLBACK_LOCALE
   */
  language?: string;

  /**
   * Optional. Query selector for the HTML element where the chat will be mounted.
   * If not provided, it will be created automatically in the body.
   */
  element?: string;

  /**
   * Optional. Specifies the environment in which the chat is running.
   * Should be one of the values defined in the ENVIRONMENTS object.
   */
  environment?: keyof typeof ENVIRONMENTS;

  /**
   * Optional. If set to true, enables debug mode for additional logging and debugging information.
   */
  debug?: boolean;

  /**
   * Optional. When set to true, the chat interface is configured to appear
   * "always online" providing a continuous and responsive user experience.
   *
   * This setting ensures that the chat interface remains accessible to users at all times,
   * creating a perception of constant availability.
   */
  always_online?: boolean;

  /**
   * Optional. When set to true, displays a "Powered by" attribution in the chat interface.
   */
  powered_by?: boolean;

  /**
   * Contains configurations for different forms within the chat interface.
   */
  forms: Record<string, Form>;

  /**
   * Configuration for the colors used in the chat interface.
   */
  colors: {
    primary: string;
  };

  /**
   * Localizable texts.
   */
  texts: Record<string, Partial<LocalizableTexts>>;
}
```

Check `src/types/chat-box.ts` to see all types in detail.
