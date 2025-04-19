import Image from "next/image";
import React from "react";

const PayTest = () => {
  return (
    <div>
      <Image
        src="/qrcode.jpeg"
        alt="Placeholder"
        width={250}
        height={250}
        className="mx-auto mb-4"
      />
    </div>
  );
};

export default PayTest;
