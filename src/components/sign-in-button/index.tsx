interface PublicProps {
  signIn: () => void;
}

type Props = PublicProps;

export const SignInButton = (props: Props) => {
  return <button onClick={props.signIn}>Sign In!</button>;
};
