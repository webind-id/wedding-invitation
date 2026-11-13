// <phantom-ui> di JSX React 19 (namespace react/jsx-runtime, bukan JSX global milik paket).
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PhantomUiProps = PhantomUiAttributes & Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, keyof PhantomUiAttributes>;

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiProps;
    }
  }
}

declare module "react" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiProps;
    }
  }
}
