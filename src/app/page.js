import Image from "next/image";
import DecryptionText from "./decrypionAnimation";

export default function Home() {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label>Username:</label>
          <div className="font-mono text-green-500">
            <DecryptionText text="johndoe" />
          </div>
        </div>
        <div>
          <label>Password:</label>
          <div className="font-mono text-green-500">
            <DecryptionText text="hunter2" />
          </div>
        </div>
      </div>
    </>
  );
}
