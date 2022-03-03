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
      <Link href="/" passHref>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Link>

      {items.map((item, index) => {
        if (item.href === undefined) {
          return (
            <Breadcrumb.Item active key={index}>
              {item.text}
            </Breadcrumb.Item>
          );
        } else {
          return (
            <Link href={item.href} passHref key={index}>
              <Breadcrumb.Item>{item.text}</Breadcrumb.Item>
            </Link>
          );
        }
      })}
    </Breadcrumb>
  );
};

export default BreadcrumpComponent;
