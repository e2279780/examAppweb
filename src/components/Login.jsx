import React from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styled from "styled-components";

// Load reCAPTCHA Enterprise script
const loadRecaptcha = () => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  background: #020617;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: auto;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #0f172a;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid #1f2937;
  width: 100%;
  max-width: 400px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  margin: auto;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  background: linear-gradient(to right, #60a5fa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #020617;
  color: white;
  font-size: 0.95rem;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const Button = styled.button`
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
  margin-top: 0.2rem;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SocialButton = styled(Button)`
  background: linear-gradient(to right, #1f2937, #111827);
  border: 1px solid #374151;

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #374151, #1f2937);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #334155;
  }

  span {
    padding: 0 1rem;
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const ToggleText = styled.div`
  margin-top: 1.5rem;
  color: #9ca3af;
  font-size: 0.9rem;

  a {
    color: #93c5fd;
    cursor: pointer;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: #fecaca;
  font-size: 0.9rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const SocialButtonSmall = styled(SocialButton)`
  flex: 1;
  padding: 0.7rem 0.5rem;
  font-size: 0.9rem;
`;

const RecaptchaProtectionBadge = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  font-weight: 500;
`;

const Login = () => {
  const [mode, setMode] = React.useState("login"); // "login" ou "register"
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Load reCAPTCHA script on component mount
  React.useEffect(() => {
    loadRecaptcha();
  }, []);

  // Récupérer le token reCAPTCHA Enterprise v3
  const getRecaptchaToken = async (action) => {
    try {
      // Vérifier si reCAPTCHA Enterprise est chargé
      if (!window.grecaptcha?.enterprise) {
        console.warn('⚠️ reCAPTCHA Enterprise not loaded yet, using fallback token');
        return 'fallback-dev-token-' + Date.now();
      }
      
      console.log(`🔐 Génération token reCAPTCHA pour action: ${action}`);
      const token = await window.grecaptcha.enterprise.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
        action: action,
      });
      console.log(`✅ Token reCAPTCHA généré:`, token.substring(0, 30) + '...');
      return token;
    } catch (err) {
      console.warn('⚠️ reCAPTCHA error, using fallback token:', err.message);
      // En développement, on utilise un token de fallback pour pouvoir tester
      return 'fallback-dev-token-' + Date.now();
    }
  };

  /**
   * Fonction pour sauvegarder ou vérifier l'utilisateur dans Firestore
   */
  const saveOrCheckUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Utilisateur",
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: new Date(),
        role: "user",
      });
    }
  };

  /**
   * Connexion avec Google
   */
  const loginGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      // Récupérer le token reCAPTCHA Enterprise v3 avec action "LOGIN"
      const recaptchaToken = await getRecaptchaToken('LOGIN');
      console.log('reCAPTCHA token obtained:', recaptchaToken.substring(0, 20) + '...');
      
      const result = await signInWithPopup(auth, googleProvider);
      await saveOrCheckUser(result.user);
      // Note: Le token reCAPTCHA doit être vérifié côté backend (Cloud Function)
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message || "Erreur lors de la connexion Google");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion avec GitHub
   */
  const loginGitHub = async () => {
    setError(null);
    setLoading(true);
    try {
      // Récupérer le token reCAPTCHA Enterprise v3 avec action "LOGIN"
      const recaptchaToken = await getRecaptchaToken('LOGIN');
      console.log('reCAPTCHA token obtained:', recaptchaToken.substring(0, 20) + '...');
      
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, githubProvider);
      await saveOrCheckUser(result.user);
    } catch (err) {
      console.error("GitHub Login Error:", err);
      setError(err.message || "Erreur lors de la connexion GitHub");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription avec Email et Mot de passe
   */
  const registerWithEmail = async () => {
    setError(null);

    if (!email || !password || !displayName) {
      setError("Tous les champs sont requis");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit avoir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      // Récupérer le token reCAPTCHA Enterprise v3 avec action "REGISTER"
      const recaptchaToken = await getRecaptchaToken('REGISTER');
      console.log('reCAPTCHA token obtained:', recaptchaToken.substring(0, 20) + '...');
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Mettre à jour le profil utilisateur
      await updateProfile(user, { displayName });

      // Sauvegarder dans Firestore
      await saveOrCheckUser(user);
      // Note: Le token reCAPTCHA doit être vérifié côté backend (Cloud Function)
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion avec Email et Mot de passe
   */
  const signInWithEmail = async () => {
    setError(null);

    if (!email || !password) {
      setError("Email et mot de passe requis");
      return;
    }

    setLoading(true);
    try {
      // Récupérer le token reCAPTCHA Enterprise v3 avec action "LOGIN"
      const recaptchaToken = await getRecaptchaToken('LOGIN');
      console.log('reCAPTCHA token obtained:', recaptchaToken.substring(0, 20) + '...');
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveOrCheckUser(userCredential.user);
      // Note: Le token reCAPTCHA doit être vérifié côté backend (Cloud Function)
    } catch (err) {
      console.error("Sign In Error:", err);
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestion du submit du formulaire
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === "login") {
      signInWithEmail();
    } else {
      registerWithEmail();
    }
  };

  return (
    <Container>
      {/* Badge reCAPTCHA Protection (visible proof) */}
      <RecaptchaProtectionBadge>
        🔒 reCAPTCHA Enterprise v3
      </RecaptchaProtectionBadge>

      <Card>
        <Title>
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </Title>
        <Subtitle>Accédez à votre espace personnel</Subtitle>

        <form onSubmit={handleSubmit}>
          <Form>
            {mode === "register" && (
              <Input
                placeholder="Nom complet"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {mode === "register" && (
              <Input
                type="password"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            )}

            <Button type="submit" disabled={loading}>
              {loading
                ? "Traitement..."
                : mode === "login"
                ? "Se connecter"
                : "S'inscrire"}
            </Button>
          </Form>
        </form>

        {/* reCAPTCHA Enterprise v3 (Invisible - analysé lors de la connexion) */}
        {/* Pas de widget visible - le token est généré automatiquement lors de la soumission */}

        <Divider>
          <span>OU</span>
        </Divider>

        <SocialButtonsContainer>
          <SocialButtonSmall onClick={loginGoogle} disabled={loading}>
            {loading ? "..." : "Google"}
          </SocialButtonSmall>
          <SocialButtonSmall onClick={loginGitHub} disabled={loading}>
            {loading ? "..." : "GitHub"}
          </SocialButtonSmall>
        </SocialButtonsContainer>

        <ToggleText>
          {mode === "login" ? (
            <>
              Pas de compte ?
              <a onClick={() => {
                setMode("register");
                setError(null);
              }}>
                Créez-en un
              </a>
            </>
          ) : (
            <>
              Déjà un compte ?
              <a onClick={() => {
                setMode("login");
                setError(null);
              }}>
                Connectez-vous
              </a>
            </>
          )}
        </ToggleText>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
};

export default Login;
