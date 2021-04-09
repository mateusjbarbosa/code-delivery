FROM ubuntu

RUN apt-get update && \
  apt-get install -y apt-transport-https ca-certificates curl gnupg

# gcloud installation
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y

# kubeclt installation
RUN curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg && \
  echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | \
  tee /etc/apt/sources.list.d/kubernetes.list && \
  apt-get update && \
  apt-get install -y kubectl

# helm installation
RUN curl https://baltocdn.com/helm/signing.asc | apt-key add - && \
  apt-get install apt-transport-https --yes && \
  echo "deb https://baltocdn.com/helm/stable/debian/ all main" | \
  tee /etc/apt/sources.list.d/helm-stable-debian.list && \
  apt-get update && \
  apt-get install helm