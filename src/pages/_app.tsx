import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeContext, Theme } from "~/utils/themeContext";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import React from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = React.useState(Theme.Light);
  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
      <Component {...pageProps} />
      </ThemeContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
