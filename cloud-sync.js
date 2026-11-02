(() => {
  const config = window.TOCFL_AUTH_CONFIG || {};
  let client = null;
  let user = null;
  let onAuthChange = () => {};
  let initError = '';

  function configured() {
    return Boolean(config.supabaseUrl && config.publishableKey && /^https:\/\//i.test(config.supabaseUrl));
  }

  function getClient() { return client; }
  function getUser() { return user; }
  function getError() { return initError; }

  async function initialize(callback) {
    onAuthChange = typeof callback === 'function' ? callback : () => {};
    if (!configured()) return { configured: false };
    if (!window.supabase?.createClient) {
      initError = 'The sign-in service could not load. Check your internet connection and reload.';
      return { configured: true, error: initError };
    }
    try {
      client = window.supabase.createClient(config.supabaseUrl, config.publishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      user = data.session?.user || null;
      client.auth.onAuthStateChange((event, session) => {
        user = session?.user || null;
        window.setTimeout(() => onAuthChange(user, event), 0);
      });
      await onAuthChange(user, 'INITIAL_SESSION');
      return { configured: true };
    } catch (error) {
      initError = error?.message || 'The sign-in service could not start.';
      return { configured: true, error: initError };
    }
  }

  async function signUp({ email, password, displayName }) {
    return client.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.href
      }
    });
  }

  async function signIn(email, password) {
    return client.auth.signInWithPassword({ email, password });
  }

  async function signOut() { return client.auth.signOut(); }

  async function updateDisplayName(displayName) {
    return client.auth.updateUser({ data: { display_name: displayName } });
  }

  async function sendPasswordReset(email) {
    return client.auth.resetPasswordForEmail(email, { redirectTo: window.location.href });
  }

  async function updatePassword(password) { return client.auth.updateUser({ password }); }

  async function loadProgress(userId) {
    return client.from('study_progress')
      .select('user_id, progress, official_vocabulary, official_known, updated_at, revision')
      .eq('user_id', userId)
      .maybeSingle();
  }

  async function saveProgress(userId, snapshot, revision) {
    const values={
      progress: snapshot.progress,
      official_vocabulary: snapshot.officialVocabulary,
      official_known: snapshot.officialKnown,
      updated_at: new Date().toISOString(),
      revision: revision ? revision+1 : 1
    };
    if(revision) return client.from('study_progress').update(values)
      .eq('user_id',userId).eq('revision',revision)
      .select('user_id, progress, official_vocabulary, official_known, updated_at, revision').maybeSingle();
    return client.from('study_progress').insert({user_id:userId,...values})
      .select('user_id, progress, official_vocabulary, official_known, updated_at, revision').maybeSingle();
  }

  return Object.freeze({
    configured, getClient, getUser, getError, initialize,
    signUp, signIn, signOut, updateDisplayName, sendPasswordReset, updatePassword,
    loadProgress, saveProgress
  });
})();
