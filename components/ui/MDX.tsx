import Link from "next/link";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
} from "react";
import Callout from "./Callout";
import CodeBlock from "./CodeBlock";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function CustomLink({ href = "", children, ...props }: AnchorProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function CustomImage({ src = "", alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  // MDX authors provide plain paths; render through next/image for optimization.
  return (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt}
      width={1200}
      height={630}
      className="img-fluid rounded-3 my-4"
      style={{ height: "auto" }}
      {...(props as Record<string, unknown>)}
    />
  );
}

const components = {
  a: CustomLink,
  img: CustomImage,
  pre: (props: HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
  Callout,
};

export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <div className="article-prose">
      <Component components={components} />
    </div>
  );
}
