import { VirtualScroller } from "primereact/virtualscroller";

export default function Listing<T>({
  header,
  itemTemplate,
  items,
  width,
  height,
}: {
  header: JSX.Element | undefined;
  itemTemplate: (item: T) => JSX.Element;
  items: T[];
  width?: string;
  height?: string;
}) {
  return (
    <>
      {header}
      <VirtualScroller
        items={items}
        itemSize={50}
        itemTemplate={itemTemplate}
        style={{
          height: height,
          width: width,
        }}
      />
    </>
  );
}
