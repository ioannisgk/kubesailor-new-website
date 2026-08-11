// 0. Preloader Handler (Minimum 250ms preload overlay on page load / refresh)
(() => {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;
  const startTime = performance.now();
  const MIN_DURATION = 250;

  const hidePreloader = () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, remaining);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect & Back-to-Top Button
  const header = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    if (window.scrollY > 8) {
      header.classList.add('border-b', 'border-border', 'bg-surface/85', 'backdrop-blur-xl');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('border-b', 'border-border', 'bg-surface/85', 'backdrop-blur-xl');
      header.classList.add('bg-transparent');
    }

    if (backToTopBtn) {
      if (window.scrollY > 200) {
        backToTopBtn.classList.add('show-btn');
      } else {
        backToTopBtn.classList.remove('show-btn');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      menuIconOpen.classList.add('hidden');
      menuIconClose.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    }
  };

  mobileBtn.addEventListener('click', toggleMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(el => {
    el.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // 3. Contact Modal Logic
  const modal = document.getElementById('contact-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTopicTitle = document.getElementById('modal-topic-title');
  const messageInput = document.getElementById('contact-message');
  const contactForm = document.getElementById('contact-form');
  const contactSent = document.getElementById('contact-sent');
  const sentTopicText = document.getElementById('sent-topic-text');
  let currentTopic = "Blueprint package";

  const openModal = (topic) => {
    currentTopic = topic || "Blueprint package";
    modalTopicTitle.textContent = currentTopic;
    messageInput.value = "Interested in: " + currentTopic + ".";
    contactForm.classList.remove('hidden');
    contactSent.classList.add('hidden');

    document.body.style.overflow = 'hidden';

    modal.classList.remove('hidden');
    // Force reflow for smooth CSS transition animation
    void modal.offsetWidth;
    modal.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('modal-open');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = btn.getAttribute('data-open-modal');
      openModal(topic);
    });
  });

  modalBackdrop.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sentTopicText.textContent = currentTopic.toLowerCase();
    contactForm.classList.add('hidden');
    contactSent.classList.remove('hidden');
  });

  // 4. Architecture Tabs Logic
  const archTabsData = {
    admin: {
      kicker: "Management plane",
      title: "Admin & governance control cluster",
      body: "An isolated, hardened management plane running GitLab CE, the ArgoCD GitOps engine, the Harbor registry and a Prometheus/Thanos telemetry stack.",
      points: [
        "Ubuntu 24.04 LTS control plane nodes",
        "Automated GitOps sync via ArgoCD",
        "Centralised GitLab and Harbor credential management"
      ],
      specs: [
        ["Control nodes", "3× control plane + worker"],
        ["CPU per node", "8 vCPU / 16 GB RAM"],
        ["Disk", "SSD / NVMe"],
        ["Network", "Static IP topology"]
      ]
    },
    compute: {
      kicker: "Workload runtime",
      title: "Workload compute cluster with Istio Ambient",
      body: "A high-throughput bare metal execution layer running Istio Ambient for sidecarless L7 routing, HAProxy + Keepalived load balancing and Jenkins CI/CD integration.",
      points: [
        "Sidecarless L7 proxy routing with Istio Ambient",
        "Containerised workloads via kubeadm and ArgoCD",
        "HAProxy + Keepalived VRRP virtual IP load balancing"
      ],
      specs: [
        ["Compute nodes", "4× bare metal (1 CP + 3 worker)"],
        ["CPU per node", "8 vCPU / 16 GB RAM minimum"],
        ["Disk", "SSD / NVMe OS drive"],
        ["Network", "Static IP interface"]
      ]
    },
    storage: {
      kicker: "Persistent storage",
      title: "Rook-Ceph distributed storage cluster",
      body: "An enterprise distributed storage pool built on raw NVMe drives, providing HA block storage (RWO/RWX), a shared filesystem (CephFS) and an S3-compatible object endpoint.",
      points: [
        "Sub-millisecond NVMe OSD throughput",
        "Automatic 3× replication and failover recovery",
        "Built-in S3 object storage API endpoint"
      ],
      specs: [
        ["Storage nodes", "3× dedicated storage servers"],
        ["OSDs per node", "4–8 datacenter NVMe SSDs"],
        ["RAM", "64 GB+ for Ceph caching"],
        ["Network", "Dedicated storage topology"]
      ]
    }
  };

  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const archKicker = document.getElementById('arch-kicker');
  const archTitle = document.getElementById('arch-title');
  const archBody = document.getElementById('arch-body');
  const archPoints = document.getElementById('arch-points');
  const archSpecs = document.getElementById('arch-specs');

  const checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 h-4 w-4 shrink-0 text-brand"><path d="M20 6 9 17l-5-5"/></svg>';

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-arch-tab');
      const data = archTabsData[tabKey];
      if (!data) return;

      tabBtns.forEach(b => {
        if (b === btn) {
          b.className = 'arch-tab-btn cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition bg-ink text-ink-foreground';
        } else {
          b.className = 'arch-tab-btn cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition border border-border bg-surface text-muted-foreground hover:text-foreground';
        }
      });

      archKicker.textContent = data.kicker;
      archTitle.textContent = data.title;
      archBody.textContent = data.body;

      archPoints.innerHTML = data.points.map(p =>
        `<li class="flex items-start gap-2.5 text-sm">${checkSvg}<span>${p}</span></li>`
      ).join('');

      archSpecs.innerHTML = data.specs.map(([k, v]) =>
        `<div class="flex items-baseline justify-between gap-6 py-3"><dt class="text-muted-foreground">${k}</dt><dd class="text-right font-medium">${v}</dd></div>`
      ).join('');
    });
  });

  // 5. TCO Calculator Logic
  const euroFormatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const sliderVcpu = document.getElementById('slider-vcpu');
  const sliderRam = document.getElementById('slider-ram');
  const sliderStorage = document.getElementById('slider-storage');
  const sliderBandwidth = document.getElementById('slider-bandwidth');

  const valVcpu = document.getElementById('val-vcpu');
  const valRam = document.getElementById('val-ram');
  const valStorage = document.getElementById('val-storage');
  const valBandwidth = document.getElementById('val-bandwidth');

  const calcAws = document.getElementById('calc-aws');
  const calcKube = document.getElementById('calc-kube');
  const calcAnnual = document.getElementById('calc-annual');
  const calcPercent = document.getElementById('calc-percent');

  const updateCalc = () => {
    const vcpu = Number(sliderVcpu.value);
    const ram = Number(sliderRam.value);
    const storage = Number(sliderStorage.value);
    const bandwidth = Number(sliderBandwidth.value);

    valVcpu.textContent = vcpu.toLocaleString() + " vCPU";
    valRam.textContent = ram.toLocaleString() + " GB";
    valStorage.textContent = storage.toLocaleString() + " TB";
    valBandwidth.textContent = bandwidth.toLocaleString() + " TB";

    const aws = Math.round(vcpu * 42 + ram * 4.5 + storage * 120 + bandwidth * 90);
    const kube = Math.round(vcpu * 11 + ram * 1.2 + storage * 25 + bandwidth * 15 + 800);
    const monthly = aws - kube;
    const annual = monthly * 12;
    const percent = Math.min(88, Math.round((monthly / aws) * 100));

    calcAws.textContent = euroFormatter.format(aws);
    calcKube.textContent = euroFormatter.format(kube);
    calcAnnual.textContent = euroFormatter.format(annual);
    calcPercent.textContent = "≈ " + percent + "% lower monthly run-rate than the hyperscaler equivalent.";
  };

  [sliderVcpu, sliderRam, sliderStorage, sliderBandwidth].forEach(s => {
    s.addEventListener('input', updateCalc);
  });
  updateCalc();

});

