Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  resources :sites, only: [:show]

  namespace :users do
    namespace :current do
      resources :sites, only: [:index, :create, :destroy]
    end
  end
end
