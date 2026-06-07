import { useEffect } from "react";
import { useState } from "react";

// sample: 6775-6589-1532-2107-6299,3803-7907-1713-0507-1839,7292-6233-9688-3552-7414,3739-9007-5357-6283-6650,2326-3466-4077-2483-2576,2475-7661-8196-9102-3730,4806-8800-2432-9044-7424,1637-2995-0266-0108-3365,5161-9177-1089-2951-0628

const Home = () => {
  const [value, setValue] = useState("");
  const [tokens, setTokens] = useState([]);
  const [totalTokenCount, setTotalTokenCount] = useState(0);

  const accurateLength = 180;

  const handleTokenSubmitted = (id) => {
    setTokens((prev) => {
      return prev.map((token) => {
        if (token.id === id) {
          return {
            ...token,
            isSubmitted: true,
          };
        }
        return token;
      });
    });
  };

  useEffect(() => {
    const realValue = value.length ? value.trim() : "";
    const tokenArray = realValue.split(",");
    const validTokenCheck = realValue.length
      ? tokenArray.reduce(
          (acc, cur) =>
            acc + cur.split("-").reduce((acc, cur) => acc + cur.length, 0),
          0,
        )
      : 0;

    setTotalTokenCount(validTokenCheck);

    if (realValue && validTokenCheck === accurateLength) {
      if (tokenArray.length) {
        setTokens(
          tokenArray.map((token) => {
            return {
              id: crypto.randomUUID(),
              value: token,
              isSubmitted: false,
            };
          }),
        );
      }
    } else setTokens([]);

    console.log("value", realValue.length);
  }, [value]);

  return (
    <div className="max-w-md mx-auto mt-10 text-center flex justify-center w-full">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold">Meter Simplify</h1>
        <p className="text-gray-600 text-sm">Simplify your meter reading</p>

        <textarea
          className="border-2 border-blue-400 rounded-lg mt-3"
          rows={8}
          cols={60}
          name="metertokenreader"
          id="metertokenreader"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>

        <h3 className="text-1xl font-semibold mb-2 text-left text-black">
          Total Token Count: {totalTokenCount}
        </h3>

        <h3 className="text-1xl font-bold text-left text-blue-600">
          Token List:
        </h3>

        <div className="flex-col items-start">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <div className={`p-2 border-[1px] border-gray-700 flex justify-center gap-2 ${token.isSubmitted ? "line-through" : ""}`} key={token.id}>
                <p>{token.value}</p>
                <button
                  disabled={token.isSubmitted}
                  onClick={() => handleTokenSubmitted(token.id)}
                  className={`ml-2 text-white bg-blue-600 px-2 rounded-lg ${
                    token.isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {token.isSubmitted ? "Submitted" : "Submit"}
                </button>
              </div>
            ))
          ) : (
            <div className="mt-3 text-red-500">
              <p>
                Not a Valid Token, Token should be {accurateLength} characters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
