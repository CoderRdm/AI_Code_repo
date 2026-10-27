import SignupForm from "./SignupForm";

export default function Hero() {
  return (
    <section className="w" id="join" style={{ paddingTop: 12 }}>
      <h1>Practice the coding rounds LeetCode doesn’t cover.</h1>
      <p className="sub">
        Fix real bugs in a real repo, with an AI helper beside you. Then get a report on how you
        worked, not just whether the tests passed.
      </p>
      <SignupForm />
    </section>
  );
}
