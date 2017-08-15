required_plugins = %w(vagrant-host-shell vagrant-docker-compose)
required_plugins.each do |plugin|
  system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
end

Vagrant.configure("2") do |config|
  config.vm.define :ubuntu do |ubuntu|
    
    ubuntu.vm.hostname = :ubuntu
    ubuntu.vm.box = 'ubuntu/trusty64'

    ubuntu.vm.provider :virtualbox do |vb|
      vb.gui = false
      vb.cpus = 2
      vb.memory = 4096 # works with 1024, 512 will need a swap file
    end

    apiPort = 9090
    uiPort = 4200


    #config.vm.sync_folder "v-root", "/vagrant", :nfs => true
    config.vm.network "private_network", ip: "150.100.56.2"
    # config.vm.network "forwarded_port", guest: apiPort, host: apiPort
    # config.vm.network "forwarded_port", guest: 8000, host: 8000
    # config.vm.network "forwarded_port", guest: uiPort, host: uiPort
    config.vm.provision :docker
    config.vm.provision :docker_compose, yml:'/vagrant/docker-compose.yml', compose_version: "1.11.2"

  end

end