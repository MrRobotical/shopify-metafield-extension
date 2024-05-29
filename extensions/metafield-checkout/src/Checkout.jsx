import { useEffect, useState } from "react";
import {
  reactExtension,
  useCartLineTarget,
  Text,
  useAppMetafields,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
export default reactExtension(
  "purchase.checkout.cart-line-item.render-after",
  () => <App />,
);

function App() {
  // Use the merchant-defined metafield for fragile instructions and map it to a cart line
  const fragileMetafields = useAppMetafields({
    type: "product",
    namespace: "instructions",
    key: "fragile",
  });
  const cartLineTarget = useCartLineTarget();

  const [fragileInstructions, setfragileInstructions] = useState("");

  useEffect(() => {
    // Get the product ID from the cart line item
    const productId = cartLineTarget?.merchandise?.product?.id;
    if (!productId) {
      return;
    }

    const fragileMetafield = fragileMetafields.find(({ target }) => {
      // Check if the target of the metafield is the product from our cart line
      return `gid://shopify/Product/${target.id}` === productId;
    });

    // If we find the metafield, set the fragile instructions for this cart line
    if (typeof fragileMetafield?.metafield?.value === "string") {
      setfragileInstructions(fragileMetafield.metafield.value);
    }
  }, [cartLineTarget, fragileMetafields]);

  // Render the fragile instructions if applicable
  if (fragileInstructions) {
    return <Text>{fragileInstructions}</Text>;
  }

  return null;
}
