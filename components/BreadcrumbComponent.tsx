import type { NextPage } from "next";
import Link from "next/link";
import { Breadcrumb } from "react-bootstrap";

interface Props {
  items: {
    href?: string;
    text: string;
  }[];
}

const BreadcrumpComponent: NextPage<Props> = ({ items }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <Breadcrumb.Item active key={item.text}>
              {item.text}
            </Breadcrumb.Item>
          );
        } else {
          return (
            <Link href={item.href} passHref key={item.text}>
              <Breadcrumb.Item>{item.text}</Breadcrumb.Item>
            </Link>
          );
        }
      })}
    </Breadcrumb>
  );
};

export default BreadcrumpComponent;
